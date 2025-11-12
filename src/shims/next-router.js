export function useRouter() {
  const push = (to) => window.location.assign(to);
  const replace = (to) => window.location.replace(to);
  const params = new URLSearchParams(window.location.search);
  const query = Object.fromEntries(params.entries());
  return { push, replace, query };
}

// also support "import Router from 'next/router'"
const Router = {
  push: (to) => window.location.assign(to),
  replace: (to) => window.location.replace(to),
};
export default Router;
