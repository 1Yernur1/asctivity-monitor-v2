"use client";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import { ActivityListBoard } from "./components/ActivityListBoard";
import { ActivityCreateModal } from "./components/ActivityCreateDialog";
import { HomeHeader } from "./components/HomeHeader";
import { ProjectsSideBar } from "./components/ProjectsSideBar";
import { jwtDecode } from "jwt-decode";
import { ActivityModel } from "./model/ActivityModel";

export default function HomePage() {
  const [showActivityCreateModal, setShowActivityCreateModal] = useState(false);
  const [activitiesList, setActivitiesList] = useState<ActivityModel[]>([]);
  const [projectId, setProjectId] = useState(1);
  const [isLoadingActivitiesList, setIsLoadingActivitiesList] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (token) {
      const decodedToken = jwtDecode(token);
    }
    setIsLoadingActivitiesList(true);
    fetch(
      `https://activity-monitoring-m950.onrender.com/activities/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("idToken")}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setActivitiesList(data))
      .catch((err) => setActivitiesList([]))
      .finally(() => {
        setIsLoadingActivitiesList(false);
      });
  }, []);
  const handleCloseActivityCreateModal = () =>
    setShowActivityCreateModal(false);

  const handleSetActivitiesList = (selectedActivitiesList: ActivityModel[]) =>
    setActivitiesList(selectedActivitiesList);

  const handleSelectProjectId = (selectedProjectId: number) =>
    setProjectId(selectedProjectId);

  const handleIsLoadingActivitiesList = (isLoading: boolean) =>
    setIsLoadingActivitiesList(isLoading);

  return (
    <Suspense fallback={<Loading />}>
      <HomeHeader setShowActivityCreateModal={setShowActivityCreateModal} />
      <div className="h-full pt-16 grid grid-cols-6">
        <ProjectsSideBar
          onClickSelectProjectActivitiesList={handleSetActivitiesList}
          onSelectProjectId={handleSelectProjectId}
          onIsLoadingActivitiesList={handleIsLoadingActivitiesList}
        />
        <ActivityListBoard
          activitiesList={activitiesList}
          isLoadingActivitiesList={isLoadingActivitiesList}
        />
      </div>
      <ActivityCreateModal
        showActivityCreateModal={showActivityCreateModal}
        onCloseActivityCreateModal={handleCloseActivityCreateModal}
        projectId={projectId}
      />
    </Suspense>
  );
}
