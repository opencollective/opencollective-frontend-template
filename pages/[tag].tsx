import Page, { categories, getStaticProps } from './index';

export async function getStaticPaths() {
  return {
    paths: categories.filter(c => c.tag).map(category => ({ params: { tag: category.tag } })),
    fallback: false, // can also be true or 'blocking'
  };
}

export { getStaticProps };

export default Page;
