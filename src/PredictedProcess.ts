import { spawn, type ChildProcess } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

export class PredictedProcess {
  private _childProcess: ChildProcess | null = null;
  private _signalToProcessMap = new Map<
    AbortSignal | string,
    { isResolved: boolean }
  >();

  public constructor(
    public readonly id: number,
    public readonly command: string,
  ) {}

  /**
   * Spawns and manages a child process to execute a given command, with handling for an optional AbortSignal.
   *
   * WRITE UP:
   * (Please provide a detailed explanation of your approach, specifically the reasoning behind your design decisions. This can be done _after_ the 1h30m time limit.)
   *
   * ...
   *
   */
  public async run(signal?: AbortSignal): Promise<void> {
    const cachedResult = signal && this._signalToProcessMap.get(signal);
    if (cachedResult?.isResolved) {
      return;
    }
    if (signal && signal.aborted) throw new EvalError('Signal already aborted');
    const childProcess = await spawn(this.command, { signal });
    this._signalToProcessMap.set(signal || uuidv4(), { isResolved: false });
    signal?.addEventListener(
      'abort',
      () => {
        childProcess.kill();
      },
      { once: true },
    );
    childProcess.on('close', () => {
      childProcess.removeAllListeners();
      if (childProcess.killed) throw new EvalError('Process killed');
      const cachedResult = signal && this._signalToProcessMap.get(signal);
      if (cachedResult) {
        cachedResult.isResolved = true;
      }
      childProcess.kill();
    });
    childProcess.on('error', (err) => {
      childProcess.removeAllListeners();
      throw err;
    });
  }

  /**
   * Returns a memoized version of `PredictedProcess`.
   *
   * WRITE UP:
   * (Please provide a detailed explanation of your approach, specifically the reasoning behind your design decisions. This can be done _after_ the 1h30m time limit.)
   *
   * ...
   *
   */
  public memoize(): PredictedProcess {
    // TODO: Implement this.
    return this;
  }
}
