export const cvPage = `
query cvPage($cvFile: String!) {
  mdx(internal: { contentFilePath: { eq: $cvFile } }) {
    id
  }
}
`;

export const handbookPages = `
query handbookPages {
  allMdx(
    filter: { internal: { contentFilePath: { glob: "**/content/handbook/**" } } }
  ) {
    nodes {
      id
      fields {
        handbookPath
      }
      internal {
        contentFilePath
      }
    }
  }
}
`;

export const postPages = `
query postPages {
  allMdx(
    filter: { internal: { contentFilePath: { glob: "**/posts/**" } } }
  ) {
    nodes {
      id
      frontmatter {
        title
        nanoId
        date
      }
      internal {
        contentFilePath
      }
    }
  }
}
`;
