import { FeedbackReportSentEvent } from '@stardust/core/reporting/events'

import { ENV } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { NotifyFeedbackJob } from '@/queue/jobs/reporting'
import { DiscordNotificationService } from '@/rest/services'
import { InngestAmqp } from '../InngestAmqp'
import { InngestFunctions } from './InngestFunctions'

export class ReportingFunctions extends InngestFunctions {
  private createNotifyFeedbackFunction() {
    return this.inngest.createFunction(
      { id: NotifyFeedbackJob.KEY },
      { event: FeedbackReportSentEvent._NAME },
      async (context) => {
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const service = new DiscordNotificationService(restClient)
        const amqp = new InngestAmqp<typeof context.event.data>(context)
        const job = new NotifyFeedbackJob(service)
        return await job.handle(amqp)
      },
    )
  }

  getFunctions() {
    return [this.createNotifyFeedbackFunction()]
  }
}
