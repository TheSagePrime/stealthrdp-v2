export function TrustedArticleBody({ html }: { html: string }) {
  return (
    <div
      className="sr-richtext"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}