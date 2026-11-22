// Local-only interaction state (likes, poll votes). A real backend would own
// these counts and sync across devices; here each viewer's taps are just
// persisted to this device, which is enough to prove the feed feels alive
// without standing up an API for a demo app.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { PollOption } from "./types";

function likeKey(postId: string) {
  return `marquee.like.${postId}`;
}
function pollKey(postId: string) {
  return `marquee.poll.${postId}`;
}

export function useReaction(postId: string, baseLikes: number) {
  const [liked, setLiked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(likeKey(postId)).then((v) => {
      if (active) {
        setLiked(v === "1");
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, [postId]);

  const toggle = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      AsyncStorage.setItem(likeKey(postId), next ? "1" : "0").catch(() => {});
      return next;
    });
  }, [postId]);

  return { liked, count: baseLikes + (liked ? 1 : 0), toggle, loaded };
}

export function usePollVote(postId: string, options: PollOption[]) {
  const [votedId, setVotedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(pollKey(postId)).then((v) => {
      if (active) {
        setVotedId(v);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, [postId]);

  const vote = useCallback(
    (optionId: string) => {
      setVotedId((prev) => {
        const next = prev === optionId ? null : optionId;
        AsyncStorage.setItem(pollKey(postId), next ?? "").catch(() => {});
        return next;
      });
    },
    [postId]
  );

  const counts = options.map((o) => ({
    ...o,
    votes: o.baseVotes + (votedId === o.id ? 1 : 0),
  }));
  const total = counts.reduce((sum, o) => sum + o.votes, 0);

  return { votedId, counts, total, vote, loaded };
}
