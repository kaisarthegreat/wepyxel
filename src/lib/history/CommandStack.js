import { updateHistoryState } from '../../stores/historyStore';

export class CommandStack {
  constructor(maxSize = 25) {
    this.maxSize = maxSize;
    this.undoStack = [];
    this.redoStack = [];
  }

  push(state) {
    this.undoStack.push(state);
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
    // New action invalidates redo stack
    this.redoStack = [];
    this.notify();
  }

  undo(currentState) {
    if (!this.canUndo()) return null;
    const targetState = this.undoStack.pop();
    if (currentState) {
      this.redoStack.push(currentState);
    }
    this.notify();
    return targetState;
  }

  redo(currentState) {
    if (!this.canRedo()) return null;
    const targetState = this.redoStack.pop();
    if (currentState) {
      this.undoStack.push(currentState);
    }
    this.notify();
    return targetState;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.notify();
  }

  notify() {
    updateHistoryState(
      this.canUndo(),
      this.canRedo(),
      this.undoStack.length,
      this.undoStack.length - 1
    );
  }
}

export const commandStack = new CommandStack();
