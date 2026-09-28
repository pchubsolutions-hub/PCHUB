import { useEffect } from "react";

function PageTitle({ title }) {
  useEffect(() => {
    document.title = `${title} | PCHUB`;
  }, [title]);

  return null;
}

export default PageTitle;