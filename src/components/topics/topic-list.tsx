import { db } from "@/db"
import { Chip } from "@nextui-org/react"
import Link from "next/link"
import paths from "@/paths"

export default async function TopicList() {
  const topics = await db.topic.findMany()

  const renderedTopics = topics.map((topic) => {
    return (
      <div key={topic.id} data-test-id="topic">
        <Link href={paths.topicShow(topic.slug)} data-test-id="link">
          <Chip color="warning" variant="shadow">
            {topic.slug}
          </Chip>
        </Link>
      </div>
    )
  })

  return (
    <div className="flex flex-row flex-wrap gap-2" data-test-id="topics">
      {renderedTopics}
    </div>
  )
}
