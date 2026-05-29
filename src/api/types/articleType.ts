/**
 * 文章分类项
 */
export interface ArticleCategory {
  id: number
  name: string
  parentId: number
  sort: number
  children?: ArticleCategory[]
}