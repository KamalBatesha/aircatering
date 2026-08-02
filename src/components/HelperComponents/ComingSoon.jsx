const ComingSoon = ({ pageName }) => {
  return (
    <div className="coming-soon">
      <img className="img" src="/images/no-text-logo.png" />
      {pageName && <p style={{ fontSize: "22px", color: 'var(--color-gold-dark)' }}>{pageName}</p>}
      <h2 className="header">Coming Soon</h2>
    </div>
  );
};

export default ComingSoon;
