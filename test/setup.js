const originalWrite = process.stdout.write.bind(process.stdout)
process.stdout.write = (chunk, ...args) => {
  if (typeof chunk === 'string' && chunk.includes('HTTP/1.1')) {
    return true
  }
  return originalWrite(chunk, ...args)
}
