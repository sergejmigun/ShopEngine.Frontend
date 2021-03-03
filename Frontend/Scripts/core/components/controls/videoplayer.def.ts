namespace UI {
    export interface IVideoPlayerInitData {
        repeat?: boolean;
        noSkin?: boolean;
        palylist?: boolean;
    }

    export interface IVideoPlayer {
        setMedia(title: string, poster: string, source: string, sourceFormat: string): void;
        play(): void;
        playNext(): void;
        playPrev(): void;
        pause(): void;
        stop(): void;
        clear(): void;
        setVolume(volume: number): void;
        mute(): void;
        unMute(): void;
        playStart(handler: () => void): void;
        playEnd(handler: () => void): void;
    }

    export interface IVideoPlayerFactory {
        init(container: IContainer, initData: IVideoPlayerInitData): Promise<IVideoPlayer>;
    }
}
