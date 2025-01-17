

import { Chat } from '@/components/chat';
import { v4 as uuid } from 'uuid';
import {ConnectButton} from "@rainbow-me/rainbowkit";
export default async function Page() {
  const id = uuid()


  return (
      <>
          <nav className="flex items-center justify-between flex-wrap bg-white p-6">
              <ConnectButton />
          </nav>
        <Chat
            key={id}
            id={id}
            initialMessages={[]}
            isReadonly={false}
        />
      </>
  );
}
