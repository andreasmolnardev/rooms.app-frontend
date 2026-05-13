import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api, getSessionToken, setSessionToken } from '../lib/api';

const todayDate = () => new Date().toISOString().slice(0, 10);

export default function DashboardPage({ initialTab = 'schedule' }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookingDate, setBookingDate] = useState(todayDate());
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('');

  const [groupForm, setGroupForm] = useState({ name: '', description: '' });
  const [joinForm, setJoinForm] = useState({ code: '', pin: '' });
  const [roomForm, setRoomForm] = useState({ name: '', capacity: '', color: '#2563eb' });
  const [userGroupForm, setUserGroupForm] = useState({ name: '', description: '' });
  const [bookingForm, setBookingForm] = useState({
    roomId: '',
    title: '',
    notes: '',
    start: '',
    end: '',
  });

  const selectedGroup = useMemo(
    () => groups.find((group) => String(group.id) === String(selectedGroupId)) || null,
    [groups, selectedGroupId]
  );

  const userRole = selectedGroup?.role || 'member';

  const loadGroups = async (preferredId) => {
    const response = await api.listGroups();
    setGroups(response.groups || []);

    const nextId =
      preferredId ||
      selectedGroupId ||
      (response.groups?.length ? String(response.groups[0].id) : null);

    setSelectedGroupId(nextId ? String(nextId) : null);
    return nextId;
  };

  const loadGroupData = async (groupId) => {
    if (!groupId) {
      setRooms([]);
      setMembers([]);
      setUserGroups([]);
      setInvitations([]);
      setBookings([]);
      return;
    }

    const [roomsRes, membersRes, userGroupsRes, invitationsRes, bookingsRes] = await Promise.all([
      api.listRooms(groupId),
      api.listMembers(groupId),
      api.listUserGroups(groupId),
      api.listInvitations(groupId),
      api.listBookings(groupId, { date: bookingDate, roomId: selectedRoomFilter || undefined }),
    ]);

    setRooms(roomsRes.rooms || []);
    setMembers(membersRes.members || []);
    setUserGroups(userGroupsRes.userGroups || []);
    setInvitations(invitationsRes.invitations || []);
    setBookings(bookingsRes.bookings || []);
  };

  useEffect(() => {
    const init = async () => {
      if (!getSessionToken()) {
        window.location.replace('/');
        return;
      }

      try {
        const me = await api.me();
        setUser(me.user);
        const groupId = await loadGroups();
        await loadGroupData(groupId);
      } catch (error) {
        setSessionToken(null);
        window.location.replace('/');
        return;
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedGroupId || loading) return;
    loadGroupData(selectedGroupId).catch((error) => {
      setStatus(error.message || 'Could not load group data');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId, bookingDate, selectedRoomFilter]);

  const onLogout = async () => {
    try {
      await api.logout();
    } catch {
      // no-op
    }
    setSessionToken(null);
    window.location.replace('/');
  };

  const submitWithRefresh = async (action, onSuccess, groupId = selectedGroupId) => {
    setStatus('');
    try {
      await action();
      await loadGroups(groupId);
      await loadGroupData(groupId);
      if (onSuccess) onSuccess();
    } catch (error) {
      setStatus(error.message || 'Operation failed');
    }
  };

  if (loading) {
    return <main className="container">Dashboard loading…</main>;
  }

  return (
    <main className="dashboard-layout">
      <aside className="panel nav-panel">
        <h1>rooms.app</h1>
        <p className="muted">Welcome, {user?.username}</p>

        <div className="tab-buttons">
          {['schedule', 'admin', 'settings'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'schedule' ? 'Belegungsplan' : tab === 'admin' ? 'Admin' : 'Einstellungen'}
            </button>
          ))}
        </div>

        <section className="stack">
          <h3>Raumgruppen</h3>
          <select
            value={selectedGroupId || ''}
            onChange={(event) => setSelectedGroupId(event.target.value || null)}
          >
            {groups.length === 0 && <option value="">Keine Gruppen</option>}
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.role})
              </option>
            ))}
          </select>

          <form
            className="mini-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitWithRefresh(
                () => api.createGroup(groupForm),
                () => setGroupForm({ name: '', description: '' })
              );
            }}
          >
            <h4>Neu erstellen</h4>
            <input
              placeholder="Gruppenname"
              value={groupForm.name}
              onChange={(event) => setGroupForm((old) => ({ ...old, name: event.target.value }))}
              required
            />
            <input
              placeholder="Beschreibung"
              value={groupForm.description}
              onChange={(event) =>
                setGroupForm((old) => ({ ...old, description: event.target.value }))
              }
            />
            <button type="submit">Gruppe erstellen</button>
          </form>

          <form
            className="mini-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitWithRefresh(
                () => api.joinGroup(joinForm),
                () => setJoinForm({ code: '', pin: '' })
              );
            }}
          >
            <h4>Beitreten</h4>
            <input
              placeholder="Einladungscode"
              value={joinForm.code}
              onChange={(event) => setJoinForm((old) => ({ ...old, code: event.target.value }))}
              required
            />
            <input
              placeholder="PIN"
              value={joinForm.pin}
              onChange={(event) => setJoinForm((old) => ({ ...old, pin: event.target.value }))}
              required
            />
            <button type="submit">Beitreten</button>
          </form>
        </section>

        <button type="button" className="danger" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <section className="content-panel">
        <header className="panel header-panel">
          <h2>{selectedGroup?.name || 'Keine Raumgruppe ausgewählt'}</h2>
          <p className="muted">
            {selectedGroup
              ? `${selectedGroup.memberCount} Mitglieder • ${selectedGroup.roomCount} Räume • ${selectedGroup.bookingCount} Buchungen`
              : 'Erstelle oder tritt einer Raumgruppe bei'}
          </p>
          {selectedGroup && (
            <p className="mono">Standard-Einladung: {selectedGroup.inviteCode} / {selectedGroup.invitePin}</p>
          )}
          {status && <p className="status">{status}</p>}
        </header>

        {activeTab === 'schedule' && (
          <section className="panel grid two">
            <article>
              <h3>Buchungen</h3>
              <div className="inline-controls">
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(event) => setBookingDate(event.target.value)}
                />
                <select
                  value={selectedRoomFilter}
                  onChange={(event) => setSelectedRoomFilter(event.target.value)}
                >
                  <option value="">Alle Räume</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              <ul className="collection">
                {bookings.length === 0 && <li className="muted">Keine Buchungen vorhanden.</li>}
                {bookings.map((booking) => (
                  <li key={booking.id}>
                    <strong>{booking.title}</strong>
                    <p>
                      {new Date(booking.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(booking.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p>
                      Raum: <span style={{ color: booking.roomColor }}>{booking.roomName}</span> • von{' '}
                      {booking.username}
                    </p>
                    {booking.notes && <p className="muted">{booking.notes}</p>}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <h3>Buchung anlegen</h3>
              <form
                className="stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!selectedGroupId) {
                    setStatus('Bitte zuerst eine Gruppe auswählen.');
                    return;
                  }

                  submitWithRefresh(
                    () =>
                      api.createBooking(selectedGroupId, {
                        roomId: bookingForm.roomId,
                        title: bookingForm.title,
                        notes: bookingForm.notes,
                        startAt: bookingForm.start,
                        endAt: bookingForm.end,
                      }),
                    () =>
                      setBookingForm({ roomId: '', title: '', notes: '', start: '', end: '' }),
                    selectedGroupId
                  );
                }}
              >
                <select
                  value={bookingForm.roomId}
                  onChange={(event) =>
                    setBookingForm((old) => ({ ...old, roomId: event.target.value }))
                  }
                  required
                >
                  <option value="">Raum auswählen</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Titel"
                  value={bookingForm.title}
                  onChange={(event) => setBookingForm((old) => ({ ...old, title: event.target.value }))}
                  required
                />
                <textarea
                  placeholder="Notizen"
                  value={bookingForm.notes}
                  onChange={(event) => setBookingForm((old) => ({ ...old, notes: event.target.value }))}
                />
                <label>
                  Start
                  <input
                    type="datetime-local"
                    value={bookingForm.start}
                    onChange={(event) => setBookingForm((old) => ({ ...old, start: event.target.value }))}
                    required
                  />
                </label>
                <label>
                  Ende
                  <input
                    type="datetime-local"
                    value={bookingForm.end}
                    onChange={(event) => setBookingForm((old) => ({ ...old, end: event.target.value }))}
                    required
                  />
                </label>
                <button type="submit">Buchen</button>
              </form>
            </article>
          </section>
        )}

        {activeTab === 'admin' && (
          <section className="panel grid three">
            <article>
              <h3>Räume</h3>
              <ul className="collection">
                {rooms.map((room) => (
                  <li key={room.id}>
                    <strong>{room.name}</strong>
                    <p>Kapazität: {room.capacity || 0}</p>
                  </li>
                ))}
              </ul>
              {userRole === 'admin' && (
                <form
                  className="mini-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitWithRefresh(
                      () => api.createRoom(selectedGroupId, roomForm),
                      () => setRoomForm({ name: '', capacity: '', color: '#2563eb' }),
                      selectedGroupId
                    );
                  }}
                >
                  <input
                    placeholder="Raumname"
                    value={roomForm.name}
                    onChange={(event) => setRoomForm((old) => ({ ...old, name: event.target.value }))}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Kapazität"
                    value={roomForm.capacity}
                    onChange={(event) =>
                      setRoomForm((old) => ({ ...old, capacity: event.target.value }))
                    }
                  />
                  <input
                    type="color"
                    value={roomForm.color}
                    onChange={(event) => setRoomForm((old) => ({ ...old, color: event.target.value }))}
                  />
                  <button type="submit">Raum hinzufügen</button>
                </form>
              )}
            </article>

            <article>
              <h3>Nutzergruppen</h3>
              <ul className="collection">
                {userGroups.map((item) => (
                  <li key={item.id}>
                    <strong>{item.name}</strong>
                    {item.description && <p className="muted">{item.description}</p>}
                  </li>
                ))}
              </ul>
              {userRole === 'admin' && (
                <form
                  className="mini-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitWithRefresh(
                      () => api.createUserGroup(selectedGroupId, userGroupForm),
                      () => setUserGroupForm({ name: '', description: '' }),
                      selectedGroupId
                    );
                  }}
                >
                  <input
                    placeholder="Name"
                    value={userGroupForm.name}
                    onChange={(event) =>
                      setUserGroupForm((old) => ({ ...old, name: event.target.value }))
                    }
                    required
                  />
                  <input
                    placeholder="Beschreibung"
                    value={userGroupForm.description}
                    onChange={(event) =>
                      setUserGroupForm((old) => ({ ...old, description: event.target.value }))
                    }
                  />
                  <button type="submit">Nutzergruppe anlegen</button>
                </form>
              )}
            </article>

            <article>
              <h3>Mitglieder & Einladungen</h3>
              <ul className="collection tight">
                {members.map((member) => (
                  <li key={member.id}>
                    <strong>{member.username}</strong>
                    <p>{member.email}</p>
                    <p className="muted">{member.role}</p>
                  </li>
                ))}
              </ul>

              <h4>Einladungen</h4>
              {userRole === 'admin' && (
                <button
                  type="button"
                  onClick={() => submitWithRefresh(() => api.createInvitation(selectedGroupId), null, selectedGroupId)}
                >
                  Einladung erzeugen
                </button>
              )}
              <ul className="collection tight">
                {invitations.map((invitation) => (
                  <li key={invitation.id}>
                    <p className="mono">
                      {invitation.code} / {invitation.pin}
                    </p>
                    <p className="muted">Status: {invitation.status}</p>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="panel grid two">
            <article>
              <h3>Mein Account</h3>
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <div className="links">
                <Link href="/change-password">Passwort ändern</Link>
                <Link href="/kontakt">Kontakt</Link>
                <Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link>
              </div>
            </article>
            <article>
              <h3>Hinweise</h3>
              <p className="muted">
                Diese Version läuft vollständig lokal mit SQLite und bildet die Kernfunktionen
                (Authentifizierung, Gruppen, Räume, Nutzergruppen, Einladungen, Buchungen,
                Account-Einstellungen) neu auf.
              </p>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}
