export const formatDateForPath = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return {
    path: `${year}/${month}/${year}-${month}-${day}.md`,
    filename: `${year}-${month}-${day}.md`,
  };
};

export const generateMarkdownContent = (entry) => {
  return `# ${entry.title}

**Date:** ${entry.date}
**Blog URL:** ${entry.blog_url || 'Not specified'}

## Description

${entry.description || 'No description provided'}

## Attachments

${entry.attachments.length > 0
  ? entry.attachments.map(att => `- ${att}`).join('\n')
  : 'No attachments'
}

## References

${entry.references.length > 0
  ? entry.references.map(ref => `- ${ref}`).join('\n')
  : 'No references'
}
`;
};