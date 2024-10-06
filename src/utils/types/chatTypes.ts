export interface fileDataType {
  name: string;
  content: string;
  type: string;
}
type roleType = "system" | "user" | "assistant";

type ContentType =
  | "text"
  | "image_url"
  | "table"
  | "audio_url"
  | "video_url"
  | "code"
  | "link"
  | "chart"
  | "embed";

export interface chatItemType {
  id: string | null;
  role: roleType;
  content:
    | string
    | [
        //input structure for gpt multimodal
        {
          type: ContentType;
          text?: string;
          image_url?: {
            url:string;
          } | string;
          //for table
          headers?: any[];
          rows?: any[];
          audio_url?: {
            url: string;
          };
          video_url?: {
            url: string;
          };
          //code
          language?: string;
          code?: string;
          //link
          url?: string;
          // chart / graphs
          chart_url?: {
            url: string;
          };
          //embedded objects
          embed_url?: {
            url: string;
          };
        }
      ];
  metrics: object | null;
  loading: boolean;
  error: string | null;
  threadId?:string | null;
}

export interface chatHistoryType{
  history: any[] | null;
  loading: boolean;
  error: string | null;
}