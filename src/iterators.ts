export class OrderedIterator<T> {
  readonly items: Array<T>
  protected index: number
  constructor(items: Array<T>) {
    this.items = items
    this.index = 0
  }
  next(): T {
    const result = this.items[this.index]
    this.index = (this.index + 1) % this.items.length
    return result
  }
}

export class ShuffleIterator<T> extends OrderedIterator<T> {
  private indexes: Array<number>
  constructor(items: Array<T>) {
    super(items)
    this.indexes = this.getShuffledIndexes()
  }

  getShuffledIndexes(): Array<number> {
    const result = Array.from(Array(this.items.length).keys())
    let currentIndex: number = result.length
    let randomIndex: number = 0

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[result[currentIndex], result[randomIndex]] = [
        result[randomIndex],
        result[currentIndex],
      ]
    }
    return result
  }

  next(): T {
    if (this.items.length === 1) return this.items[0]
    const itemIndex = this.indexes[this.index]
    this.index++
    if (this.index >= this.indexes.length) {
      this.index = 0
      this.indexes = this.getShuffledIndexes()
      if (this.indexes[0] === itemIndex) {
        const randomIndex =
          Math.floor(Math.random() * (this.indexes.length - 2)) + 2
        this.indexes.splice(randomIndex, 0, itemIndex)
        this.indexes.splice(0, 1)
      }
    }
    return this.items[itemIndex]
  }
}