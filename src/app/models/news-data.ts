export interface Root {
    payload: Payload[]
  }
  
  export interface Payload {
    meta: Meta
    body: Body
  }
  
  export interface Meta {
    responseCode: number
    hash: string
    template: string
  }
  
  export interface Body {
    results: Result[]
  }
  
  export interface Result {
    locator: string
    assetId: string
    options: Options
    type: string
    lastPublished: string
    lastUpdated: string
    url: string
    language: string
    image: Image
    summary: string
    body: any[]
    title: string
    firstPublished: string
    dateAdded: string
  }
  
  export interface Options {
    isBreakingNews: boolean
    isPriorityPost: boolean
  }
  
  export interface Image {
    href: string
    altText: string
    width: number
    height: number
    copyrightHolder: string
    ichefHref: string
  }
  