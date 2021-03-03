namespace UI {
    export interface IEmotion {
        html: string;
        name: string;
    }

    export interface IEmotionsPickerInitData {
        size: EmotionSize;
        emotions?: string[];
    }

    export interface IEmotionsPicker {
        pick(handler: (emotion: IEmotion) => void): void;
        remove(): void;
    }

    export interface IEmotionsPickerFactory {
        init(container: IContainer, initData: IEmotionsPickerInitData): Promise<IEmotionsPicker>;
        getEmotionHtml(emotionName: string, size: EmotionSize): string;
    }
}