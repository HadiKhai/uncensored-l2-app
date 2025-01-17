'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';

export function Chat({
                         id,
                         initialMessages,
                         isReadonly,
                     }: {
    id: string;
    initialMessages: Array<Message>;
    isReadonly: boolean;
}) {
    const { mutate } = useSWRConfig();

    const {
        messages,
        setMessages,
        handleSubmit,
        input,
        setInput,
        append,
        isLoading,
        stop,
        reload,
    } = useChat({
        id,
        body: { id },
        initialMessages,
        maxSteps: 5,
        experimental_throttle: 100,
        onFinish: () => {
            mutate('/api/history');
        },
    });

    const [attachments, setAttachments] = useState<Array<Attachment>>([]);

    return (
        <>
            <div className="flex flex-col min-w-0 bg-background" style={{
                height: 'calc(100vh - 88px)',
            }}>

                <Messages
                    chatId={id}
                    isLoading={isLoading}
                    messages={messages}
                    setMessages={setMessages}
                    reload={reload}
                    isReadonly={isReadonly}
                />

                <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
                    {!isReadonly && (
                        <MultimodalInput
                            chatId={id}
                            input={input}
                            setInput={setInput}
                            handleSubmit={handleSubmit}
                            isLoading={isLoading}
                            stop={stop}
                            attachments={attachments}
                            setAttachments={setAttachments}
                            messages={messages}
                            setMessages={setMessages}
                            append={append}
                        />
                    )}
                </form>
            </div>
        </>
    );
}
