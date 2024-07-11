type UnlockableItemProps<Item> = {
  item: Item
  isUnlocked: boolean
}

export class UnlockableItem<Item> extends BaseStruct<UnlockableItemProps<Item>> {
  readonly item: Item
  readonly isUnlocked: boolean

  private constructor(props: UnlockableItemProps<Item>) {
    super(props)
    this.isUnlocked = props.isUnlocked
    this.item = props.item
  }

  static create<Item>(props: UnlockableItemProps<Item>) {
    return new UnlockableItem(props)
  }

  unlock() {
    return UnlockableItem.create({ ...this.props, isUnlocked: true })
  }
}
