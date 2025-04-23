import { Logical } from './Logical'

class Node<Value = unknown> {
  readonly value: Value
  readonly nextNode: Node<Value> | null

  private constructor(value: Value, next: Node<Value> | null) {
    this.value = value
    this.nextNode = next
  }

  static create<Value>(value: Value, nextNode = null) {
    return new Node(value, nextNode)
  }

  setNextNode(newNode: Node<Value>) {
    return new Node<Value>(this.value, newNode)
  }
}

export class Amqp<NodeValue> {
  readonly firstNode: Node<NodeValue> | null
  readonly lastNode: Node<NodeValue> | null

  private constructor(
    firstNode: Node<NodeValue> | null,
    lastNode: Node<NodeValue> | null,
  ) {
    this.firstNode = firstNode
    this.lastNode = lastNode
  }

  static create<NodeValue>() {
    return new Amqp<NodeValue>(null, null)
  }

  enqueue(value: NodeValue) {
    const node = Node.create(value)

    if (this.isEmpty) {
      return new Amqp<NodeValue>(node, node)
    }

    const lastNode = this.lastNode?.setNextNode(node)
    return new Amqp<NodeValue>(this.firstNode, lastNode ?? null)
  }

  dequeue() {
    let newFirstNode = this.firstNode
    let newLastNode = this.lastNode

    if (this.firstNode) {
      newFirstNode = this.firstNode.nextNode
    } else {
      newLastNode = null
    }

    return new Amqp<NodeValue>(newFirstNode, newLastNode)
  }

  get isEmpty() {
    return Logical.create(this.firstNode === null)
  }

  get items() {
    const items: unknown[] = []
    let currentNode = this.firstNode

    while (currentNode) {
      items.push(currentNode.value)
      currentNode = currentNode.nextNode
    }
    return items
  }
}
