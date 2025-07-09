export const getClientId = () => {
  const match = document.cookie.match(/_ga=GA\d+\.\d+\.(\d+\.\d+)/)
  return match ? match[1] : null
}
