function DashboardCard({ title, value }) {

  return (
    <div className="dashboard-card">

      <h6 className="text-secondary">
        {title}
      </h6>

      <h2 className="fw-bold">
        {value}
      </h2>

    </div>
  );
}

export default DashboardCard;