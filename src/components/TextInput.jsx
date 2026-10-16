export default function TextInput({ id, className = '', ...props }) {
  return (
    <input
      id={id}
      className={`focus-ring field-control ${className}`}
      {...props}
    />
  )
}
