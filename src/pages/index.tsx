"use client";

import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import VrmViewer from "@/components/vrmViewer";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import {
  Message,
  textsToScreenplay,
  Screenplay,
} from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { SYSTEM_PROMPT, PROMPT_VERSION } from "@/features/constants/systemPromptConstants";
import {
  KoeiroParam,
  DEFAULT_KOEIRO_PARAM,
} from "@/features/constants/koeiroParam";
import { getChatResponseStream } from "@/features/chat/openAiChat";
import { M_PLUS_2, Montserrat } from "next/font/google";
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
import { GitHubLink } from "@/components/githubLink";
import { Meta } from "@/components/meta";
import {
  ElevenLabsParam,
  DEFAULT_ELEVEN_LABS_PARAM,
} from "@/features/constants/elevenLabsParam";
import { buildUrl } from "@/utils/buildUrl";
import { websocketService } from "../services/websocketService";
import { MessageMiddleOut } from "@/features/messages/messageMiddleOut";
import MouseGlow from "@/components/mouseGlow";
import { useWallet } from "@/contexts/WalletContext";
import { canChat, getIvaResponse } from "@/features/constants/ivaResponses";
import { IvaResponseSystem } from "@/features/constants/ivaResponseSystem";
import { WalletInfo } from "@/components/walletInfo";
import { IvaStatus } from "@/components/ivaStatus";
import { WalletConnectButton } from "@/components/walletConnectButton";

const m_plus_2 = M_PLUS_2({
  variable: "--font-m-plus-2",
  display: "swap",
  preload: false,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  display: "swap",
  subsets: ["latin"],
});

type LLMCallbackResult = {
  processed: boolean;
  error?: string;
};

export default function Home() {
  const { viewer } = useContext(ViewerContext);
  const { connected, balance } = useWallet();

  // Bloqueia o app até clicar "Start"
  const [appUnlocked, setAppUnlocked] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT);

  // Caso seja necessário, mantemos openAiKey; as chaves sensíveis agora são gerenciadas no backend.
  const [openAiKey, setOpenAiKey] = useState("");

  // As chaves sensíveis (OpenRouter, ElevenLabs) não são gerenciadas no frontend.
  const [openRouterKey] = useState<string>("");
  const [elevenLabsKey] = useState("");

  // Parâmetros
  const [elevenLabsParam, setElevenLabsParam] =
    useState<ElevenLabsParam>(DEFAULT_ELEVEN_LABS_PARAM);
  const [koeiroParam, setKoeiroParam] =
    useState<KoeiroParam>(DEFAULT_KOEIRO_PARAM);

  // Controle de chat e fala
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  // Outros estados
  const [restreamTokens, setRestreamTokens] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  
  // Animation system
  const idleCleanupRef = useRef<(() => void) | null>(null);

  // Initialize idle animation system
  useEffect(() => {
    if (viewer?.model?.emoteController && connected) {
      // Cleanup previous idle loop
      if (idleCleanupRef.current) {
        idleCleanupRef.current();
      }
      
      // Start new idle loop
      idleCleanupRef.current = IvaResponseSystem.startIdleLoop(balance, viewer);
    }
    
    // Cleanup on unmount
    return () => {
      if (idleCleanupRef.current) {
        idleCleanupRef.current();
      }
    };
  }, [viewer, connected, balance]);

  // Carrega dados não sensíveis do LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedParams = window.localStorage.getItem("chatVRMParams");
      const storedVersion = window.localStorage.getItem("promptVersion");
      
      if (storedParams && storedVersion === PROMPT_VERSION) {
        const parsed = JSON.parse(storedParams);
        setSystemPrompt(parsed.systemPrompt);
        setElevenLabsParam(parsed.elevenLabsParam);
        setChatLog(parsed.chatLog);
      } else {
        // Forçar atualização do prompt se a versão mudou
        setSystemPrompt(SYSTEM_PROMPT);
        setChatLog([]); // Limpa o chat log para evitar confusão
        window.localStorage.setItem("promptVersion", PROMPT_VERSION);
      }
      
      const storedBg = window.localStorage.getItem("backgroundImage");
      if (storedBg) setBackgroundImage(storedBg);
    }
  }, []);

  // Salva dados não sensíveis no LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "chatVRMParams",
        JSON.stringify({ systemPrompt, elevenLabsParam, chatLog })
      );
      window.localStorage.setItem("promptVersion", PROMPT_VERSION);
    }
  }, [systemPrompt, elevenLabsParam, chatLog]);

  // Ajusta background
  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
    } else {
      document.body.style.backgroundImage = `url(${buildUrl("/bg-c.png")})`;
    }
  }, [backgroundImage]);

  // Edita histórico de mensagens
  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      const newLog = chatLog.map((msg, idx) =>
        idx === targetIndex ? { role: msg.role, content: text } : msg
      );
      setChatLog(newLog);
    },
    [chatLog]
  );

  /** Fala cada sentença com ElevenLabs */
  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      currentElevenLabsKey: string, // compatibilidade (não é usada)
      currentElevenLabsParam: ElevenLabsParam,
      onStart?: () => void,
      onEnd?: () => void
    ) => {
      setIsAISpeaking(true);
      
      // Apply mood animation based on the text content
      if (screenplay.talk && screenplay.talk.message) {
        IvaResponseSystem.applyMoodAnimation(screenplay.talk.message, balance, viewer);
      }
      
      try {
        await speakCharacter(
          screenplay,
          currentElevenLabsKey,
          currentElevenLabsParam,
          viewer,
          () => {
            setIsPlayingAudio(true);
            console.log("Audio started");
            onStart?.();
          },
          () => {
            setIsPlayingAudio(false);
            console.log("Audio ended");
            onEnd?.();
          }
        );
      } catch (error) {
        console.error("Error in speakCharacter:", error);
      } finally {
        setIsAISpeaking(false);
      }
    },
    [viewer]
  );

  /** Envia mensagem ao backend e processa a resposta */
  const handleSendChat = useCallback(
    async (text: string) => {
      if (!text) return;
      setChatProcessing(true);

      // Verifica se o usuário pode conversar baseado no balance
      if (!connected || !IvaResponseSystem.canChat(balance)) {
        const ivaResponse = IvaResponseSystem.getEnhancedResponse(text, balance, viewer);
        
        // Only proceed if Iva has a response
        if (ivaResponse.shouldSpeak && ivaResponse.message) {
          // Adiciona mensagem do usuário
          const messageLog: Message[] = [
            ...chatLog,
            { role: "user" as const, content: text },
          ];
          setChatLog(messageLog);

          // Adiciona resposta da Iva sem chamar a API
          const updatedLog: Message[] = [
            ...messageLog,
            { role: "assistant" as const, content: ivaResponse.message },
          ];
          setChatLog(updatedLog);
          setAssistantMessage(ivaResponse.message);
          
          // Faz a Iva falar a resposta pronta
          const talks = textsToScreenplay([ivaResponse.message], koeiroParam);
          if (talks.length > 0 && talks[0].talk.message.trim()) {
            handleSpeakAi(
              talks[0],
              elevenLabsKey,
              elevenLabsParam,
              () => {
                console.log("Iva falando resposta pronta:", talks[0].talk.message);
              },
              () => {
                console.log("Iva terminou de falar");
              }
            );
          }
        }
        
        setChatProcessing(false);
        return;
      }

      // Adiciona mensagem do usuário
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user" as const, content: text },
      ];
      setChatLog(messageLog);

      // Processa as mensagens
      const processor = new MessageMiddleOut();
      const processed = processor.process([
        { role: "system", content: systemPrompt },
        ...messageLog,
      ]);

      // Chama getChatResponseStream (que utiliza o endpoint do backend com chave protegida)
      const stream = await getChatResponseStream(processed, openAiKey, openRouterKey)
        .then((res) => res)
        .catch((e) => {
          console.error(e);
          return null;
        });

      if (!stream) {
        setChatProcessing(false);
        return;
      }

      const reader = stream.getReader();
      let buffer = "";
      let aiTextLog = "";
      let tag = "";
      const sentences: string[] = [];

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += value;

          // Checa se existe tag [algo...]
          const tagMatch = buffer.match(/^\[(.*?)\]/);
          if (tagMatch && tagMatch[0]) {
            tag = tagMatch[0];
            buffer = buffer.slice(tag.length);
          }

          // Identifica uma sentença finalizada
          const sentenceMatch = buffer.match(
            /^(.+[。．！？\n.!?]|.{10,}[、,])/
          );
          if (sentenceMatch && sentenceMatch[0]) {
            const sentence = sentenceMatch[0];
            sentences.push(sentence);
            buffer = buffer.slice(sentence.length).trimStart();

            if (
              !sentence.replace(
                /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
                ""
              )
            ) {
              continue;
            }

            const aiText = `${tag} ${sentence}`;
            aiTextLog += aiText;

            const talks = textsToScreenplay([aiText], koeiroParam);
            const currentAssistantMessage = sentences.join(" ");

            handleSpeakAi(
              talks[0],
              elevenLabsKey, // não é usado, apenas compatibilidade
              elevenLabsParam,
              () => {
                setAssistantMessage(currentAssistantMessage);
              },
              undefined
            );
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        reader.releaseLock();
      }

      const updatedLog: Message[] = [
        ...messageLog,
        { role: "assistant" as const, content: aiTextLog },
      ];
      setChatLog(updatedLog);
      setChatProcessing(false);
    },
    [
      chatLog,
      systemPrompt,
      openAiKey,
      openRouterKey,
      elevenLabsKey,
      elevenLabsParam,
      koeiroParam,
      handleSpeakAi,
      connected,
      balance,
    ]
  );

  const handleTokensUpdate = useCallback((tokens: any) => {
    setRestreamTokens(tokens);
  }, []);

  useEffect(() => {
    websocketService.setLLMCallback(
      async (message: string): Promise<LLMCallbackResult> => {
        if (isAISpeaking || isPlayingAudio || chatProcessing) {
          return { processed: false, error: "System is busy or speaking" };
        }
        try {
          await handleSendChat(message);
          return { processed: true };
        } catch (err) {
          console.error(err);
          return {
            processed: false,
            error: err instanceof Error ? err.message : "Unknown error",
          };
        }
      }
    );
  }, [chatProcessing, isAISpeaking, isPlayingAudio, handleSendChat]);

  return (
    <div className={`${m_plus_2.variable} ${montserrat.variable}`}>
      <Meta />
      <MouseGlow />
      <WalletInfo />
      <IvaStatus />
      {!appUnlocked && <Introduction onStart={() => setAppUnlocked(true)} />}
      {appUnlocked && (
        <>
          <VrmViewer />
          <WalletConnectButton />
          <MessageInputContainer
            isChatProcessing={chatProcessing}
            onChatProcessStart={handleSendChat}
          />
          <Menu
            openAiKey={openAiKey}
            systemPrompt={systemPrompt}
            chatLog={chatLog}
            elevenLabsParam={elevenLabsParam}
            koeiroParam={koeiroParam}
            assistantMessage={assistantMessage}
            onChangeAiKey={setOpenAiKey}
            onChangeSystemPrompt={setSystemPrompt}
            onChangeChatLog={handleChangeChatLog}
            onChangeElevenLabsVoice={() => {}}  // Função vazia para cumprir a prop
            onChangeKoeiroParam={setKoeiroParam}
            handleClickResetChatLog={() => setChatLog([])}
            handleClickResetSystemPrompt={() => setSystemPrompt(SYSTEM_PROMPT)}
            backgroundImage={backgroundImage}
            onChangeBackgroundImage={setBackgroundImage}
            onTokensUpdate={handleTokensUpdate}
            onChatMessage={handleSendChat}
            openSettingsOnLoad={true}
          />
          <Analytics />
          <GitHubLink />
        </>
      )}
    </div>
  );
}
