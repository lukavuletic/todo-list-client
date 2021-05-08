interface ICoreClient {
    post: (query: string) => Promise<Response>
}

export type { ICoreClient};