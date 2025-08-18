export default class Queue<T> {
  data: Array<T> = [];

  public push(item: T) {
    this.data.push(item);
  }

  public front(): T {
    if (this.isEmpty())
      throw new Error("Queue is empty");
    
    return this.data[0];
  }

  public pop(): T {
    if (this.isEmpty())
      throw new Error("Queue is empty");

    return this.data.splice(0, 1)[0];
  }

  public isEmpty(): boolean {
    return this.data.length == 0;
  }
}