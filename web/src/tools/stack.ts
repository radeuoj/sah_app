export default class Stack<T> {
  data: Array<T> = [];

  public push(item: T) {
    this.data.push(item);
  }

  public top(): T {
    if (this.isEmpty())
      throw new Error("Stack is empty");
    
    return this.data[this.data.length - 1];
  }

  public pop(): T {
    if (this.isEmpty())
      throw new Error("Stack is empty");

    return this.data.pop() as T;
  }

  public isEmpty(): boolean {
    return this.data.length == 0;
  }
}