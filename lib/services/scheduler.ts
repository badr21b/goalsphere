import cron from 'node-cron'
import { contentIngestionService } from './contentIngestion'
import { supabase } from '@/store/api/baseApi'

export class SchedulerService {
  private jobs: Map<string, cron.ScheduledTask> = new Map()

  constructor() {
    this.initializeScheduledJobs()
  }

  private initializeScheduledJobs() {
    // Schedule content ingestion every 15 minutes
    this.scheduleContentIngestion()
    
    // Schedule live scores update every 2 minutes
    this.scheduleLiveScoresUpdate()
    
    // Schedule cleanup jobs daily
    this.scheduleCleanupJobs()
  }

  private scheduleContentIngestion() {
    const job = cron.schedule('*/15 * * * *', async () => {
      console.log('Starting scheduled content ingestion...')
      
      try {
        await this.runContentIngestion()
        console.log('Content ingestion completed successfully')
      } catch (error) {
        console.error('Content ingestion failed:', error)
        await this.logError('content_ingestion', error)
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    })

    this.jobs.set('content_ingestion', job)
    job.start()
  }

  private scheduleLiveScoresUpdate() {
    const job = cron.schedule('*/2 * * * *', async () => {
      console.log('Updating live scores...')
      
      try {
        await this.updateLiveScores()
        console.log('Live scores updated successfully')
      } catch (error) {
        console.error('Live scores update failed:', error)
        await this.logError('live_scores_update', error)
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    })

    this.jobs.set('live_scores_update', job)
    job.start()
  }

  private scheduleCleanupJobs() {
    const job = cron.schedule('0 2 * * *', async () => {
      console.log('Running cleanup jobs...')
      
      try {
        await this.cleanupOldData()
        console.log('Cleanup completed successfully')
      } catch (error) {
        console.error('Cleanup failed:', error)
        await this.logError('cleanup', error)
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    })

    this.jobs.set('cleanup', job)
    job.start()
  }

  private async runContentIngestion() {
    // Create ingestion job record
    const { data: job, error: jobError } = await supabase
      .from('content_ingestion_jobs')
      .insert({
        source: 'scheduled',
        status: 'running',
        started_at: new Date().toISOString(),
        articles_processed: 0,
        articles_created: 0,
        articles_updated: 0,
        errors: []
      })
      .select()
      .single()

    if (jobError) {
      throw new Error(`Failed to create ingestion job: ${jobError.message}`)
    }

    try {
      // Fetch from different sources
      const sources = ['sportmonks', 'api_football', 'web_scraping']
      let totalProcessed = 0
      let totalCreated = 0
      let totalUpdated = 0
      const allErrors: string[] = []

      for (const source of sources) {
        try {
          let articles: any[] = []

          switch (source) {
            case 'sportmonks':
              articles = await contentIngestionService.fetchFromSportmonks()
              break
            case 'api_football':
              articles = await contentIngestionService.fetchFromAPIFootball()
              break
            case 'web_scraping':
              articles = await contentIngestionService.scrapeFromWebsites()
              break
          }

          const results = await contentIngestionService.processArticles(articles)
          
          totalProcessed += results.processed
          totalCreated += results.created
          totalUpdated += results.updated
          allErrors.push(...results.errors)

        } catch (error) {
          allErrors.push(`${source}: ${error}`)
        }
      }

      // Update job status
      await supabase
        .from('content_ingestion_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          articles_processed: totalProcessed,
          articles_created: totalCreated,
          articles_updated: totalUpdated,
          errors: allErrors
        })
        .eq('id', job.id)

    } catch (error) {
      // Update job status to failed
      await supabase
        .from('content_ingestion_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          errors: [error.toString()]
        })
        .eq('id', job.id)

      throw error
    }
  }

  private async updateLiveScores() {
    // This would fetch live scores from APIs and update the database
    // For now, we'll just log that it's running
    console.log('Live scores update would run here')
  }

  private async cleanupOldData() {
    // Clean up old ingestion jobs (older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    await supabase
      .from('content_ingestion_jobs')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())

    // Clean up old ad clicks (older than 90 days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    await supabase
      .from('ad_clicks')
      .delete()
      .lt('timestamp', ninetyDaysAgo.toISOString())

    // Clean up old ingestion errors (older than 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    await supabase
      .from('ingestion_errors')
      .delete()
      .lt('created_at', sevenDaysAgo.toISOString())
  }

  private async logError(jobType: string, error: any) {
    try {
      await supabase
        .from('ingestion_errors')
        .insert({
          source: jobType,
          error_message: error.toString(),
          error_data: { stack: error.stack }
        })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
  }

  // Manual job triggers
  async triggerContentIngestion() {
    console.log('Manually triggering content ingestion...')
    await this.runContentIngestion()
  }

  async triggerLiveScoresUpdate() {
    console.log('Manually triggering live scores update...')
    await this.updateLiveScores()
  }

  async triggerCleanup() {
    console.log('Manually triggering cleanup...')
    await this.cleanupOldData()
  }

  // Job management
  startJob(jobName: string) {
    const job = this.jobs.get(jobName)
    if (job) {
      job.start()
      console.log(`Started job: ${jobName}`)
    }
  }

  stopJob(jobName: string) {
    const job = this.jobs.get(jobName)
    if (job) {
      job.stop()
      console.log(`Stopped job: ${jobName}`)
    }
  }

  getJobStatus(jobName: string) {
    const job = this.jobs.get(jobName)
    return job ? job.getStatus() : 'not_found'
  }

  getAllJobsStatus() {
    const status: Record<string, string> = {}
    for (const [name, job] of this.jobs) {
      status[name] = job.getStatus()
    }
    return status
  }

  destroy() {
    for (const [name, job] of this.jobs) {
      job.destroy()
      console.log(`Destroyed job: ${name}`)
    }
    this.jobs.clear()
  }
}

export const schedulerService = new SchedulerService()
