export interface ICoreClient {
    post: (query: string) => Promise<Response>
}