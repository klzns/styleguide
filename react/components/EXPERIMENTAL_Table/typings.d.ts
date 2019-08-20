interface Column {
  title: string
  cellRender?: ({ cellData: any, rowData: any }) => React.ReactNode
  headerRender?: ({ headerData: any }) => React.ReactNode
}

interface ColumnObject {
  [key: string]: Column
}

interface TableState {
  columns?: ColumnObject
  items?: Array<Object>
  isEmpty?: boolean
  tableHeight?: number
}