import { ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react"

const SortableHeader = ({
    field,
    currentField,
    currentOrder,
    onSort,
    children
}) => {
  return (
    <th onClick={() => onSort(field)}>
      <div className="sort-header">
        {children}
        {currentField !== field ? (
            <ChevronsUpDown size={16} />
        ) : currentOrder === 'asc' ? (
            <ChevronUp size={16} />
        ) : (
            <ChevronDown size={16} />
        )}
      </div>
    </th>
  )
}

export default SortableHeader
