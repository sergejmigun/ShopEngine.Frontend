namespace UI {
    export interface IAudioPlayerInitData {
        direction: AccordionDirection;
        height: number;
        currentPanelIndex: number;
        panels: IAccordionPanel[];
        repeat: boolean;
        palylist: boolean;
        noSkin: boolean;
    }

    export interface IAudioPlayer {
        setMedia(title: string, source: string, sourceFormat: string): void;
        play(): void;
        playNext(): void;
        playPrev(): void;
        pause(): void;
        stop(): void;
        clear(): void;
        setVolume(volume: number): void;
        mute(): void;
        unMute(): void;
    }

    export interface IAudioPlayerFactory {
        init(container: IContainer, initData: IAudioPlayerInitData): Promise<IAccordion>;
    }
}
