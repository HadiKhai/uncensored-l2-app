import { Chat } from '@/components/chat';
import { v4 as uuid } from 'uuid';
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {SidebarTrigger} from "@/components/ui/sidebar";
export default async function Page() {
  const id = uuid()


  return (
      <>
          <main className={"w-full"}>
              <nav className="flex items-center justify-between flex-wrap bg-white p-6">

                  <div className="flex items-center flex-shrink-0 text-white mr-6 gap-2">
                      <h1 className="text-2xl font-bold text-gray-800">
                          Uncensored L2
                      </h1>
                      <SidebarTrigger color={"black"} />
                  </div>

                  <ConnectButton />
              </nav>
              <Chat
                  key={id}
                  id={id}
                  initialMessages={[]}
                  isReadonly={false}
              />
          </main>
      </>
  );
}
