const UserCard = ({ user, onToggleFollow, onMessage }) => {
  return (
    <div className="card">
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <div className="actions">
        <button onClick={() => onToggleFollow(user)} className={user.is_following ? 'secondary' : ''}>
          {user.is_following ? 'Unfollow' : 'Follow'}
        </button>
        <button className="secondary" onClick={() => onMessage(user.id)}>Message</button>
      </div>
    </div>
  );
};

export default UserCard;
