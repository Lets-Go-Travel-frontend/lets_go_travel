/**
 * flows.test.ts
 * Tests para el motor de flujos (State Machine).
 */
import { FlowContext } from '../flows/FlowContext';
import { FlowExecutor } from '../flows/FlowExecutor';
import { BaseFlowStep } from '../flows/FlowStep';

class MockStep extends BaseFlowStep {
  constructor(public name: string, private fn: (ctx: FlowContext) => Promise<void>) {
    super();
  }
  async execute(ctx: FlowContext): Promise<void> {
    await this.fn(ctx);
  }
}

describe('Flow State Machine', () => {
  it('debe ejecutar los pasos en orden y compartir el contexto', async () => {
    const context = new FlowContext({ bookingToken: 'initial' });
    const executor = new FlowExecutor(context);
    
    const stepsRoot: string[] = [];

    executor
      .addStep(new MockStep('Step 1', async (ctx) => {
        stepsRoot.push('1');
        ctx.rateKey = 'rk-123';
      }))
      .addStep(new MockStep('Step 2', async (ctx) => {
        stepsRoot.push('2');
        expect(ctx.rateKey).toBe('rk-123');
        ctx.metadata.foo = 'bar';
      }));

    await executor.execute();

    expect(stepsRoot).toEqual(['1', '2']);
    expect(context.metadata.foo).toBe('bar');
  });

  it('debe detenerse y lanzar error si un paso falla', async () => {
    const context = new FlowContext();
    const executor = new FlowExecutor(context);
    
    executor
      .addStep(new MockStep('Success', async () => {}))
      .addStep(new MockStep('Failure', async () => {
         throw new Error('Boom');
      }))
      .addStep(new MockStep('Unreachable', async () => {}));

    await expect(executor.execute()).rejects.toThrow('Boom');
  });

  it('debe ejecutar onError si el paso lo define', async () => {
    const context = new FlowContext();
    const executor = new FlowExecutor(context);
    let errorHandled = false;

    const stepWitherror = {
      name: 'ErrorStep',
      execute: async () => { throw new Error('Fail'); },
      onError: async () => { errorHandled = true; }
    };

    executor.addStep(stepWitherror);

    try {
      await executor.execute();
    } catch (e) {
      // expected
    }

    expect(errorHandled).toBe(true);
  });
});
