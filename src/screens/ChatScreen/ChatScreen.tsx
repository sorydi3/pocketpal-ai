import React, {useRef, ReactNode} from 'react';

import {observer} from 'mobx-react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Bubble, ChatView} from '../../components';

import {useChatSession} from '../../hooks';

import {ModelNotLoadedMessage} from './ModelNotLoadedMessage';

import {modelStore, chatSessionStore} from '../../store';

import {L10nContext} from '../../utils';
import {MessageType} from '../../utils/types';
import {user, assistant} from '../../utils/chat';

const renderBubble = ({
  child,
  message,
  nextMessageInGroup,
}: {
  child: ReactNode;
  message: MessageType.Any;
  nextMessageInGroup: boolean;
}) => (
  <Bubble
    child={child}
    message={message}
    nextMessageInGroup={nextMessageInGroup}
  />
);

export const ChatScreen: React.FC = observer(() => {
  const context = modelStore.context;
  const currentMessageInfo = useRef<{createdAt: number; id: string} | null>(
    null,
  );
  const l10n = React.useContext(L10nContext);
  const messages = chatSessionStore.currentSessionMessages;

  const {handleSendPress, handleStopPress, inferencing, isStreaming} =
    useChatSession(context, currentMessageInfo, messages, user, assistant);

  // Show loading bubble only during the thinking phase (inferencing but not streaming)
  const isThinking = inferencing && !isStreaming;

  return (
    <SafeAreaProvider>
      <ChatView
        customBottomComponent={
          !context && !modelStore.isContextLoading
            ? () => <ModelNotLoadedMessage />
            : undefined
        }
        renderBubble={renderBubble}
        messages={messages}
        onSendPress={handleSendPress}
        onStopPress={handleStopPress}
        user={user}
        isStopVisible={inferencing}
        isThinking={isThinking}
        isStreaming={isStreaming}
        sendButtonVisibilityMode="editing"
        textInputProps={{
          editable: !!context,
          placeholder: !context
            ? modelStore.isContextLoading
              ? l10n.loadingModel
              : l10n.modelNotLoaded
            : l10n.typeYourMessage,
        }}
      />
    </SafeAreaProvider>
  );
});
