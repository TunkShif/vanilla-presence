type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any
  ? R
  : never

type Machine<State extends string> = { [state in State]: { [event: string]: State } }
type MachineState<T> = keyof T
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>
type MachineHandler<T> = {
  [State in MachineState<T>]: () => void
} & { default?: (state: MachineState<T>) => void }

export const createMachine = <S extends string, M extends Machine<S>>(
  initialState: MachineState<M>,
  machine: M,
  handlers: MachineHandler<M>
) => {
  const current = { state: initialState }

  const reduce = (state: MachineState<M>, event: MachineEvent<M>): MachineState<M> => {
    const next = (machine[state] as any)[event]
    return next ?? initialState
  }

  const send = (event: MachineEvent<M>) => {
    const next = reduce(current.state, event)
    const handler = handlers[next]
    const defaultHandler = handlers.default
    current.state = next
    handler?.()
    defaultHandler?.(next)
  }

  return { current, send }
}
