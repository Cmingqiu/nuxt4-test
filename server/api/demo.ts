export default defineEventHandler(async event => {
  // const foo = getCookie(event, 'foo')
  // const foo = getHeader(event, 'foo')
  // const foo = getQuery(event, 'foo')
  // const foo = getRequestHeader(event, 'foo')
  // const foo = getRequestURL(event)
  // const foo = getRequestMethod(event)
  // const foo = getRequestBody(event)
  // const foo = getRequestFiles(event)
  // const foo = getRequestFormData(event)
  // const foo = getResponseHeader(event, 'foo')
  // const foo = getResponseStatus(event)
  // const foo = getResponseStatusText(event)
  // const foo = getResponseHeaders(event)
  // const foo = getResponseBody(event)
  // const foo = getResponseBody(event)
  return { message: 'Hello World', status: 200 };
});

export type DemoResponse = Awaited<
  ReturnType<typeof defineEventHandler<{ message: string; status: number }>>
>;
