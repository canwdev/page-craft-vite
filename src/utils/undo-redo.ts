export class UndoRedo {
  undoStack: any[] = []
  redoStack: any[] = []
  maxStackSize = 100

  constructor(maxStackSize: number = 10) {
    this.maxStackSize = maxStackSize
  }

  get lastUndo(): any {
    return this.undoStack[this.undoStack.length - 1] || null
  }

  get lastRedo(): any {
    return this.redoStack[this.redoStack.length - 1] || null
  }

  public recordUndo(item: any) {
    if (this.lastRedo === item) {
      return
    }
    this.undoStack.push(item)
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift()
    }
    this.redoStack = []
  }

  public undo(now): any {
    if (this.undoStack.length > 0) {
      this.redoStack.push(now)
      return this.undoStack.pop()
    }
    return null
  }

  public redo(now): any {
    if (this.redoStack.length > 0) {
      this.undoStack.push(now)
      return this.redoStack.pop()
    }
    return null
  }

  public clear() {
    this.undoStack = []
    this.redoStack = []
  }

  public getCount() {
    return this.undoStack.length + this.redoStack.length
  }
}
