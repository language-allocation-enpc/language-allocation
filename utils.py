def weights_list(n, M):
    return [i**2 for i in range(n)]+[float('INF') for i in range(M-n)]
