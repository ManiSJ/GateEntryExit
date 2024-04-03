namespace GateEntryExit.Service
{
    public interface ICacheService
    {
        T GetData<T>(string key);

        void SetData<T>(string key, T value, DateTimeOffset expirationTime);

        void RemoveData(string key);

        void RemoveDatas(string keyPattern);
    }
}
