import { Entity } from '#global/domain/abstracts/index'
import { AuthorAggregate } from '#global/domain/aggregates/AuthorAggregate'
import { Image } from '#global/domain/structures/Image'
import { Text } from '#global/domain/structures/Text'
import { FeedbackIntent } from '../structures'
import type { FeedbackReportDto } from './dtos'

type FeedbackReportProps = {
  content: Text
  screenshot?: Image
  intent: FeedbackIntent
  author: AuthorAggregate
  sentAt: Date
}

export class FeedbackReport extends Entity<FeedbackReportProps> {
  static create(dto: FeedbackReportDto) {
    return new FeedbackReport(
      {
        content: Text.create(dto.content),
        screenshot: dto.screenshot ? Image.create(dto.screenshot) : undefined,
        intent: FeedbackIntent.create(dto.intent),
        author: AuthorAggregate.create(dto.author),
        sentAt: dto.sentAt ? new Date(dto.sentAt) : new Date(),
      },
      dto.id,
    )
  }

  get content(): Text {
    return this.props.content
  }

  get screenshot(): Image | undefined {
    return this.props.screenshot
  }

  get intent(): FeedbackIntent {
    return this.props.intent
  }

  get author(): AuthorAggregate {
    return this.props.author
  }

  get sentAt(): Date {
    return this.props.sentAt
  }

  get dto(): FeedbackReportDto {
    return {
      id: this.id.value,
      content: this.content.value,
      intent: this.intent.value,
      screenshot: this.screenshot?.value,
      author: this.author.dto,
      sentAt: this.sentAt.toISOString(),
    }
  }
}
