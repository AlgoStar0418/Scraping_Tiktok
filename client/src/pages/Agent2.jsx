import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Limit } from "../lib/atom";
import TiktokTrending from "../components/features/agent2/tiktok/TiktokTrending";

const Agent2 = () => {
  const limit = useRecoilValue(Limit);
  const [redo, setRedo] = useState(false)
  useEffect(() => {
    setRedo(!redo)
  }, [])
  return <TiktokTrending redo={redo} limit={limit} />;

};

export default Agent2;
