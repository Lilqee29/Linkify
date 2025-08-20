import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { collection, doc, getDocs, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // adjust your import
import * as Icons from "lucide-react";

const IconFor = ({ type }) => {
  const map = {
    instagram: Icons.Instagram,
    youtube: Icons.Youtube,
    github: Icons.Github,
    twitter: Icons.Twitter,
    link: Icons.Link
  };
  const Cmp = map[type?.toLowerCase()] || map.link;
  return <Cmp className="w-5 h-5" />;
};

export default function PublicProfile() {
  const { username } = useParams();
  const [userDoc, setUserDoc] = useState(null);
  const [links, setLinks] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      // find user by username
      const q = query(collection(db, "users"), where("username", "==", username));
      const snap = await getDocs(q);
      if (snap.empty) return setNotFound(true);
      const docRef = doc(db, "users", snap.docs[0].id);
      const user = await getDoc(docRef);
      setUserDoc({ id: docRef.id, ...user.data() });

      // fetch links ordered
      const linksSnap = await getDocs(
        query(collection(db, "users", docRef.id, "links"), orderBy("order", "asc"))
      );
      setLinks(linksSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(l => l.active));
    })();
  }, [username]);

  if (notFound) return <Navigate to="/" />; // or a 404 page
  if (!userDoc) return null;

  const accent = "from-orange-500 to-orange-800";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-6 py-12">
        {/* avatar + name */}
        <div className="flex flex-col items-center space-y-4">
          {userDoc.avatarUrl && (
            <img src={userDoc.avatarUrl} alt="" className="w-24 h-24 rounded-full border border-neutral-800" />
          )}
          <h1 className="text-2xl font-bold">{userDoc.displayName || userDoc.username}</h1>
          {userDoc.bio && <p className="text-neutral-400 text-center">{userDoc.bio}</p>}
        </div>

        {/* links */}
        <div className="mt-8 space-y-4">
          {links.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between border border-neutral-800 bg-neutral-900/50 rounded-lg px-4 py-3 hover:bg-neutral-900 transition"
              onClick={() => {
                // naive client-side click increment (can be replaced by a Cloud Function)
                // import { updateDoc, doc, increment } from 'firebase/firestore'
                // updateDoc(doc(db, "users", userDoc.id, "links", link.id), { clicks: increment(1) });
              }}
            >
              <div className="flex items-center gap-3">
                <IconFor type={link.iconType} />
                <span className="font-medium">{link.title}</span>
              </div>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accent}`}>Open</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
