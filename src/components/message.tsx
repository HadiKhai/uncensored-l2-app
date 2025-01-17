'use client';

import type { Message } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';

import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { SparklesIcon} from "@/components/icons";
import Markdown from "react-markdown";
import {Button} from "@/components/ui/button";
import {useWriteContract} from "wagmi";
import {Address, parseAbi} from "viem";

const PurePreviewMessage = ({
  message,
}: {
  message: Message;
}) => {

    const { writeContractAsync } = useWriteContract()
    console.log('PreviewMessage', message);
  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:w-fit',
            // {
            //   'w-full': mode === 'edit',
            //   'group-data-[role=user]/message:w-fit': mode !== 'edit',
            // },
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
              {message.content && (
                  <div className="flex flex-row gap-2 items-start">


                      <div
                          className={cn('flex flex-col gap-4', {
                              'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                                  message.role === 'user',
                          })}
                      >
                          <Markdown>{message.content as string}</Markdown>
                      </div>
                  </div>
              )}

            {message.toolInvocations && message.toolInvocations.length > 0 && (
              <div className="flex flex-col gap-4">
                {message.toolInvocations.map((toolInvocation) => {
                  const { toolName, toolCallId, state } = toolInvocation;

                  if (state === 'result') {
                    const { result } = toolInvocation as { result: [Address,Address,string,number,boolean,Address]}

                      const transactionArgs: [`0x${string}`, `0x${string}`, bigint, bigint, boolean, `0x${string}`] = [
                            result[0],
                            result[1],
                            BigInt(result[2]),
                            BigInt(result[3]),
                            result[4],
                            result[5]
                        ]

                      console.log(transactionArgs)
                    return (
                      <div key={toolCallId}>
                        {toolName === "swapEthL2" ? (
                            // <Markdown>{result}</Markdown>
                            <Button onClick={()=>{
                                writeContractAsync({
                                    address:"0x6A20DAA469A26aF06BDC012147996030BB08106F",
                                    abi: parseAbi([
                                        `function forwardDepositTx(address _portal,address _to,uint256 _value,uint64 _gasLimit,bool _isCreation,bytes calldata _data) payable`
                                    ]),
                                    functionName:"forwardDepositTx",
                                    args:transactionArgs,
                                    gas:BigInt(150000),
                                })
                            }}>
                                Execute Swap
                            </Button>
                        ):
                            (
                          <pre>{JSON.stringify(result, null, 2)}</pre>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={toolCallId}
                      className={cx({
                        skeleton: ['swapEthL2'].includes(toolName),
                      })}
                    >
                      {toolName === 'swapEthL2' ? (
                        null
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.message.content !== nextProps.message.content) return false;
    if (
      !equal(
        prevProps.message.toolInvocations,
        nextProps.message.toolInvocations,
      )
    )
      return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
