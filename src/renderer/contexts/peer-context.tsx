import { createContext, Dispatch, ReactElement, useContext, useMemo, useState } from 'react';

export interface InitPeerContextType {
  id: string;
  updateId: Dispatch<string>;
}

const InitPeerContext = createContext<InitPeerContextType>({} as InitPeerContextType);

export function InitPeerProvider({ children }: { children: ReactElement }) {
  const [id, updateId] = useState<string>('');

  const memoizedValue = useMemo(
    () => ({
      id,
      updateId,
    }),
    [id],
  );

  return <InitPeerContext.Provider value={memoizedValue}>{children}</InitPeerContext.Provider>;
}

export function useInitPeer() {
  const { id, updateId } = useContext(InitPeerContext);
  return { initPeerId: id, updateInitPeerId: updateId };
}
