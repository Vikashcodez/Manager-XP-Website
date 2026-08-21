import React, { useCallback, useEffect, useRef, useState } from 'react';
import { softwareApi, assetUrl, adminAuth, shortDate } from '../../lib/adminApi';
import {
  Page, Panel, Pill, Banner, Skeleton, Empty, Button, Field, Input
} from '../../components/admin/ui';

/*
 * Software Master — the gaming titles ManagerXP publishes.
 *
 * This is one catalogue shared by every café. A café's console picks from it
 * when linking a game to a station (that link, and the launch path, are the
 * café's own data); the station then shows the artwork to the player. So the
 * name and the cover art set here are what a customer eventually looks at,
 * which is why this page leads with the image rather than a table row.
 *
 * Retiring is the normal removal: the title stops being offered, but stations
 * that already have it linked keep their artwork. Deleting permanently is
 * kept separate and demands the title be typed, because it destroys the
 * uploaded files and cannot be undone.
 */

const MAX_ICON = 5 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;

const bytes = (n) => {
  if (!n) return '';
  const mb = n / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
};

const SoftwareCard = ({ item, onEdit, onRetire, onDestroy, mayEdit }) => {
  const icon = assetUrl(item.software_icon);
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60">
      <div className="flex aspect-[16/10] items-center justify-center bg-neutral-950">
        {icon ? (
          <img
            src={icon}
            alt=""
            className="h-full w-full object-cover"
            /* A broken image would otherwise render as the browser's grey
               placeholder icon, which looks like a bug rather than a missing
               upload. */
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <span className="text-xs text-neutral-700">no artwork</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">{item.software_name}</div>
            <div className="mt-0.5 text-[10px] text-neutral-600">
              #{item.software_id} · added {shortDate(item.created_at)}
            </div>
          </div>
          {item.software_video && <Pill tone="info">video</Pill>}
        </div>
        {mayEdit && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Button variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => onEdit(item)}>Edit</Button>
            <Button variant="danger" className="!px-2 !py-1 !text-xs" onClick={() => onRetire(item)}>Retire</Button>
            <Button variant="danger" className="!px-2 !py-1 !text-xs" onClick={() => onDestroy(item)}>Delete</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const SoftwareMaster = () => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null);      // null | {} for new | the row
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const iconRef = useRef(null);
  const videoRef = useRef(null);

  const mayEdit = adminAuth.can('software.edit') || adminAuth.can('software.create');

  const load = useCallback(() => {
    softwareApi.list()
      .then((b) => { setItems(b.data || []); setError(null); })
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  /* Object URLs are revoked when they stop being shown. Without this every
     file the admin previews leaks until the tab closes. */
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const openNew = () => {
    setEditing({});
    setName('');
    setIconFile(null); setVideoFile(null);
    setPreview(null);
    setNotice(null);
  };

  const openEdit = (item) => {
    setEditing(item);
    setName(item.software_name);
    setIconFile(null); setVideoFile(null);
    setPreview(assetUrl(item.software_icon));
    setNotice(null);
  };

  const pickIcon = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_ICON) {
      setNotice({ tone: 'bad', text: `That image is ${bytes(f.size)}. The limit is 5 MB.` });
      e.target.value = '';
      return;
    }
    setIconFile(f);
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    setNotice(null);
  };

  const pickVideo = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_VIDEO) {
      setNotice({ tone: 'bad', text: `That video is ${bytes(f.size)}. The limit is 50 MB.` });
      e.target.value = '';
      return;
    }
    setVideoFile(f);
    setNotice(null);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setNotice({ tone: 'bad', text: 'Give the title a name' });

    const fd = new FormData();
    fd.append('software_name', name.trim());
    if (iconFile) fd.append('software_icon', iconFile);
    if (videoFile) fd.append('software_video', videoFile);

    setSaving(true);
    setNotice(null);
    try {
      if (editing.software_id) {
        await softwareApi.update(editing.software_id, fd);
        setNotice({ tone: 'good', text: `${name.trim()} saved. Every café console picks this up on its next refresh.` });
      } else {
        await softwareApi.create(fd);
        setNotice({ tone: 'good', text: `${name.trim()} added to the catalogue.` });
      }
      setEditing(null);
      load();
    } catch (err) {
      setNotice({ tone: 'bad', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const retire = async (item) => {
    if (!window.confirm(
      `Retire ${item.software_name}?\n\n` +
      'It stops being offered when cafés link games to a station. Stations that ' +
      'already have it keep it, and nothing is deleted.'
    )) return;
    try {
      await softwareApi.retire(item.software_id);
      load();
      setNotice({ tone: 'good', text: `${item.software_name} retired.` });
    } catch (e) { setNotice({ tone: 'bad', text: e.message }); }
  };

  const destroy = async (item) => {
    /* Typing the name, not clicking OK. This destroys the uploaded artwork and
       video, and any station still linked to it loses both. */
    const typed = window.prompt(
      `Permanently delete ${item.software_name}?\n\n` +
      'The artwork and video files are destroyed and any station still linked to ' +
      'this title loses them. This cannot be undone.\n\n' +
      `Type the title's name to confirm:`
    );
    if (typed?.trim() !== item.software_name) {
      if (typed !== null) setNotice({ tone: 'warn', text: 'That did not match — nothing was deleted.' });
      return;
    }
    try {
      await softwareApi.destroy(item.software_id);
      load();
      setNotice({ tone: 'good', text: `${item.software_name} deleted.` });
    } catch (e) { setNotice({ tone: 'bad', text: e.message }); }
  };

  return (
    <Page
      title="Software Master"
      lede="The gaming titles every café can put on a station. Cafés choose from this list and set their own launch path; the station shows this artwork to the player."
      actions={mayEdit && <Button onClick={openNew}>Add title</Button>}
    >
      {error && <Banner tone="bad">{error}</Banner>}
      {notice && <Banner tone={notice.tone}>{notice.text}</Banner>}

      {editing && (
        <Panel
          title={editing.software_id ? `Edit ${editing.software_name}` : 'Add a title'}
          description="Artwork is what a player sees on the station. Landscape images work best — they are shown in a 16:10 tile."
        >
          <form onSubmit={save} className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <div>
              <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
                {preview
                  ? <img src={preview} alt="" className="h-full w-full object-cover" />
                  : <span className="text-xs text-neutral-700">no artwork</span>}
              </div>
              <Button
                type="button" variant="ghost" className="mt-2 w-full"
                onClick={() => iconRef.current?.click()}
              >
                {preview ? 'Change artwork' : 'Choose artwork'}
              </Button>
              <input ref={iconRef} type="file" accept="image/*" hidden onChange={pickIcon} />
              <p className="mt-1 text-[11px] text-neutral-600">PNG or JPG, up to 5 MB</p>
            </div>

            <div className="space-y-4">
              <Field label="Title" id="sw-name" hint="Shown to the player exactly as typed">
                <Input id="sw-name" value={name} onChange={(e) => setName(e.target.value)}
                       placeholder="Counter-Strike 2" autoFocus />
              </Field>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Trailer
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="ghost" onClick={() => videoRef.current?.click()}>
                    {videoFile ? 'Change video' : 'Choose video'}
                  </Button>
                  <input ref={videoRef} type="file" accept="video/*" hidden onChange={pickVideo} />
                  <span className="text-xs text-neutral-500">
                    {videoFile
                      ? `${videoFile.name} (${bytes(videoFile.size)})`
                      : editing.software_video ? 'a video is already attached' : 'optional'}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-600">MP4, MOV or AVI, up to 50 MB</p>
              </div>

              {editing.software_id && (
                <p className="text-xs text-neutral-500">
                  Leaving a file unchosen keeps the one already uploaded.
                </p>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editing.software_id ? 'Save title' : 'Add to catalogue'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Panel>
      )}

      {!items ? <Skeleton rows={2} height="h-40" />
        : items.length === 0 ? (
          <Empty
            title="The catalogue is empty"
            text="Add a title and every café will be able to put it on a station."
            action={mayEdit ? <Button onClick={openNew}>Add title</Button> : null}
          />
        ) : (
          <>
            <p className="text-xs text-neutral-500">
              {items.length} title{items.length === 1 ? '' : 's'} published to every café.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((s) => (
                <SoftwareCard
                  key={s.software_id}
                  item={s}
                  mayEdit={mayEdit}
                  onEdit={openEdit}
                  onRetire={retire}
                  onDestroy={destroy}
                />
              ))}
            </div>
          </>
        )}
    </Page>
  );
};

export default SoftwareMaster;
